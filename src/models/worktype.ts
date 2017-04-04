export class WorkType {
    id: number;
    name: string;
    description: string;
    icon: string;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name
        this.description = data.description;
        this.icon = data.icon;
    }
}
