export default class UploadService {
    private static instance: UploadService;

    private constructor() {}

    public static getInstance() {
        return this.instance || (this.instance = new this());
    }
}
