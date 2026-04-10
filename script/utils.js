export class GenerateCaseSerial {
    constructor() {
        this.serialLetter = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    }
    generateNumber(min, max, amount) {
        let n = "";
        for (let i = 0; i < amount; i++) {
            n += Math.floor((Math.random() * (max - min + 1)) + min);
        }
        return n;
    }
    generateLetter(amount) {
        let l = "";
        for (let i = 0; i < amount; i++) {
            l += this.serialLetter[Number(this.generateNumber(0, 25, 1))];
        }
        return l;
    }

    generate() {
        const number = this.generateNumber(0, 9, 10);
        const letter = this.generateLetter(5);
        return `${letter}-${number}`

    }

}


export class FormatTime {
    transfor(createdAt) {
        if (!createdAt) return "時間處理中";

        const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
        if (Number.isNaN(date.getTime())) return "時間格式錯誤";

        const weekMap = ["日", "一", "二", "三", "四", "五", "六"];
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const week = weekMap[date.getDay()];
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
        const second = String(date.getSeconds()).padStart(2, "0");

        return `${year}/${month}/${day}(${week})${hour}:${minute}:${second}`;
    }
}