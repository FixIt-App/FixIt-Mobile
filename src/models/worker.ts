export class Worker {
    id: number;
    document_id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    profile_pic: string;
    rh: string;
    username: string;

    constructor(data: any) {
      this.id = data.id;
			this.document_id = data.document_id;
			this.email = data.email;
			this.first_name = data.first_name;
			this.last_name = data.last_name;
			this.phone = data.phone;
			this.profile_pic = data.profile_pic;
			this.rh = data.rh;
			this.username = data.username;
    }
}
