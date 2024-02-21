import { LightningElement, track } from 'lwc';
import roomInfo from '@salesforce/apex/CheckInn.roomInfo';

export default class AdminHomeCheckInn extends LightningElement {

    @track roomCount;
    connectedCallback(){
        this.roomInfo();
    }
    roomInfo(){
        roomInfo()
        .then(result=>{
            this.roomCount = result.length;
            console.log('result',this.roomCount);
        }).catch(error=>{
            console.log(error);
        })
    }
}