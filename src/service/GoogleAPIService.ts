import { promises as fsPromises} from "fs";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { Credentials } from "google-auth-library";
import { getRepository, Repository } from "typeorm";
import { Credential } from "../entity/Credential";
import { ModelMapper } from "../util/mapper";
import chalk from "chalk";

export default class GoogleAPIService {
    private static instance: GoogleAPIService;
    
    private oauth2Client?: OAuth2Client;
    private credentialRepository: Repository<Credential>;

    private constructor() {
        this.credentialRepository = getRepository(Credential);
    }

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }

    async getAuthUrl(scopes: string[]) {
        if (!this.oauth2Client) throw new ClientNotInitializedError();

        let shouldConsent = true;
        if (this.oauth2Client.credentials.refresh_token) shouldConsent = false;

        return this.oauth2Client!.generateAuthUrl({
            access_type: 'offline',
            scope: scopes.join(' '),
            prompt: shouldConsent ? 'consent' : undefined,
        });
    }

    async getTokens(rawToken: string) {
        if (!this.oauth2Client) throw new ClientNotInitializedError();
        const {tokens} = await this.oauth2Client.getToken(rawToken);
        return tokens;
    }

    async initClient(clientKeyPath: string) {
        const keysStr = await fsPromises.readFile(clientKeyPath, 'utf-8');
        const keys = JSON.parse(keysStr).web;
        this.oauth2Client = new google.auth.OAuth2(keys.client_id, keys.client_secret, keys.redirect_uris[0]);
        google.options({ auth: this.oauth2Client });

        const credentials = await this.credentialRepository.find();
        if (credentials.length != 0) {
            const credential = credentials[0];
            const mapper = new ModelMapper<Credential, Credentials>();
            const googleCredentials = await mapper.map(credential);
            this.oauth2Client.setCredentials(googleCredentials);
        }

        // register listener
        const client = this.oauth2Client;
        this.oauth2Client.on('tokens', async credentials => {
            console.log(chalk.green('Google OAuth2 client gets new token.'));

            client.setCredentials(credentials);

            const id = await this.resolveSub(credentials.id_token!);
            const foundCredential = await this.credentialRepository.findOne(id);

            if (foundCredential && credentials.refresh_token) this.credentialRepository.merge(foundCredential, { refresh_token: credentials.refresh_token });
            else {
                const mapper = new ModelMapper<Credentials, Credential>()
                        .addField('id', async token => await this.resolveSub(token.id_token as string));
                const credential = await mapper.map(credentials);
                this.credentialRepository.save(credential);
            }
        });
    }

    async resolveSub(idToken: string) {
        if (!this.oauth2Client) throw new ClientNotInitializedError();
        const ticket = await this.oauth2Client.verifyIdToken({
            idToken: idToken
        });
        const response = ticket.getPayload()!;

        return response.sub;
    }

    isClientAuthorized() {
        if (!this.oauth2Client) return false;
        return this.oauth2Client.credentials.access_token != null;
    }
}

class ClientNotInitializedError extends Error {
    constructor() {
        super("Google OAuth2 Client should be initialized first to call this function, try calling initClient() before calling this function.")
    }
}
