import { LightningElement, track } from 'lwc';
import roomInfo from '@salesforce/apex/CheckInn.roomInfo';
export default class RoomsCheckInn extends LightningElement {

    connectedCallback(){
        this.roomDetails();
    }
    @track rooms;
    roomDetails(){
        roomInfo()
        .then((result)=>{
            console.log('result',result);
            let arr = JSON.parse(JSON.stringify(result));
            arr.forEach((item)=>{
                if(item.Status__c =='Available'){
                    item["showBookRoomButton"] = true;
                }else{
                    item["showAlreadyBookRoomButton"] = true;
                }
            })
            
            this.rooms = arr;
        }).catch(error=>{
            console.log('error',error);
        })   
    }

    @track openBookModal = false;
    handleBookRoomClick(){
        this.openBookModal = true;
    }
    handleBookCancelButton(){
        this.openBookModal = false;
    }
 }