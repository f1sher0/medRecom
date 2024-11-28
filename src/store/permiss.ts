import { defineStore } from 'pinia';

interface ObjectList {
    [key: string]: string[];
}

export const usePermissStore = defineStore('permiss', {
    state: () => {
        const defaultList: ObjectList = {
            admin: [
                '0',
                '1',
                '11',
                '12',
                '2',
                '21',
                '22',
                '23',
                '24',
                '25',
                '26',
                '27',
                '28',
                '29',
                '291',
                '292',
                '3',
                '31',
                '32',
                '33',
                '34',
                '4',
                '41',
                '42',
                '8',
            ],
            user: ['0'],
        };
        const username = localStorage.getItem('vuems_name');
        console.log(username);
        return {
            key: (username == 'admin' ? defaultList.admin : defaultList.user) as string[],
            defaultList,
        };
    },
    actions: {
        handleSet(val: string[]) {
            this.key = val;
        },
    },
});
