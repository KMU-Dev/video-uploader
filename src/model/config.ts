export interface ApplicationConfig {
    readonly targets: TargetConig[]
    readonly google: GoogleConfig
}

export interface TargetConig {
    readonly name: string;
    readonly sourceUrl: string;
    readonly destinationFolder: string;
}

export interface GoogleConfig {
    readonly oauthClient: OAuthClient;
}

export interface OAuthClient {
    readonly keyPath: string
}