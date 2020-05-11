export class User {
    id: number;
    username: string;
    password: string;
    remember: boolean;
    constructor(username: string, password: string, remember?: boolean) {
        this.username = username;
        this.password = password;
        this.remember = remember;
    }
}
