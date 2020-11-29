import cheerio from "cheerio";
import fetch, { RequestInit, Response } from "node-fetch";
import { Buffer } from "buffer";
import { VideoInfo, VideoInfoStatus } from "../model/video";

export default class VideoResolver {

    private static readonly MEDIA_URL: string = 'http://vodcfs.kmu.edu.tw/media/';

    // request info
    private cookies: Map<string, string> = new Map();
    
    constructor(private url: string) {}

    async resolve() {
        const html = await (await this.fetch(this.url)).text();
        const $ = cheerio.load(html);

        const itemHtmlArray: string[] = [];
        $('div[id^="folder-node"]').each((_index, element) => {
            itemHtmlArray.push($(element).html()!);
        });

        const videoInfoArray: VideoInfo[] = [];
        for (const itemHtml of itemHtmlArray) {
            const itemCheer = cheerio.load(itemHtml);
            const hrefCheer = itemCheer('.fs-caption > .fs-label.fs-text-nowrap > a');
    
            const hrefValue = hrefCheer.attr('href')!
            const videoId = hrefValue.split('/')[2];
            const videoName = hrefCheer.text()!.trim() + ".mp4";
            
            const videoUrl = await this.resolveVideoUrl(videoId);
            
            const videoInfo = {
                id: +videoId, 
                name: videoName, 
                url: videoUrl,
                status: VideoInfoStatus.FINISHED
            } as VideoInfo;
            videoInfoArray.push(videoInfo);
        }

        return videoInfoArray;
    }

    private async resolveVideoUrl(videoId: string) {
        const url = VideoResolver.MEDIA_URL + videoId;
        const html = await (await this.fetch(url)).text();

        const atobExp = html.match(/(media = JSON\.parse\( atob\(')(.*)('\)\))/);
        const hashStr = (atobExp as string[])[2];
        const json = JSON.parse(Buffer.from(hashStr, 'base64').toString());

        const videoUrl: string = json.src[0].src;
        return videoUrl;
    }

    private async fetch(url: string) {
        const init: RequestInit = {};
        if (this.cookies.size > 0) {
            let cookieStr = '';
            for (const [key, value] of this.cookies) {
                cookieStr += key + '=' + value + '; ';
            }

            init.headers = { cookie: cookieStr };
        }

        const response = await fetch(url, init);
        this.saveResponseCookies(response);

        return response;
    }

    private saveResponseCookies(response: Response) {
        const rawCookies = response.headers.raw()['set-cookie'];

        if (rawCookies && rawCookies.length > 0) {
            for (const rawCookie of rawCookies) {
                const cookieStr = rawCookie.split(';')[0].trim();
                
                const [key, value] = cookieStr.split('=');
                this.cookies.set(key, value);
            }
        }
    }
}