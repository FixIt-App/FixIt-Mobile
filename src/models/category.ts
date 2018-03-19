import { WorkType } from './worktype';

export class Category {
    worktypes: WorkType[];
    name: string;

    constructor(data: any) {
        this.name = data.name
        this.worktypes = data.worktypes;
    }
}