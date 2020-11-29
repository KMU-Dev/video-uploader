export interface VideoInfo {
    id: number
    name: string
    url: string
    status: VideoInfoStatus
}

export enum VideoInfoStatus {
    CONVERTING = "CONVERTING",
    FINISHED = "FINISHED"
}
