import { LightningElement, track,api } from 'lwc';
import roomInfo from '@salesforce/apex/CheckInn.roomInfo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BookRelatedToRoom from '@salesforce/apex/CheckInn.BookRelatedToRoom';
export default class RoomsCheckInn extends LightningElement {

    connectedCallback(){
        this.fetchavailableroom();
        // this.roomDetails();
    }

    //Filter - Start
    @track AllRoomsTemplate = true;
    @track AvailableRooms = [];
    @track rooms;

    fetchavailableroom() {
        roomInfo()
            .then((result) => {
                console.log('ressss',result);
                let arr = JSON.parse(JSON.stringify(result));
                arr.forEach((item)=>{
                    if(item.Status__c =='Available'){
                        item["showBookRoomButton"] = true;
                    }else{
                        item["showAlreadyBookRoomButton"] = true;
                    }
                })
                this.AvailableRooms = arr;

                this.rooms = this.AvailableRooms.filter(item => item.Room_Type__c === this.StoreRoomType);
                if (this.rooms.length<=0) {
                    this.rooms = JSON.stringify(this.AvailableRooms);
                    console.log('AvailableRooms',this.rooms);
                }
             console.log('length', this.rooms.length);   
               
            })
            .catch((error) => {
                alert(error.body.message)
            });
    }

    @track StoreRoomType = '';
    OnClickRoomTypes(event) {
        const Roomtype = event.currentTarget.dataset.name;
        console.log('Room type',Roomtype)
        this.StoreRoomType = Roomtype;
        this.fetchavailableroom();
    }
 //Filter - End

    // roomDetails(){
    //     roomInfo()
    //     .then((result)=>{
    //         console.log('result',result);
    //         let arr = JSON.parse(JSON.stringify(result));
    //         arr.forEach((item)=>{
    //             if(item.Status__c =='Available'){
    //                 item["showBookRoomButton"] = true;
    //             }else{
    //                 item["showAlreadyBookRoomButton"] = true;
    //             }
    //         })
    //         this.rooms = arr;
    //     }).catch(error=>{
    //         console.log('error',error);
    //     })   
    // }

    @track roomId;
    @track openBookModal = false;
    handleBookRoomClick(event){
        const recordId = event.currentTarget.dataset.id;
        console.log('room ID',recordId);
        this.roomId = recordId;
        this.openBookModal = true;
    }
    handleBookCancelButton(){
        this.openBookModal = false;
    }

    handleSubmitBookRoomClick(){

        BookRelatedToRoom({roomId:this.roomId})
        .then(result=>{
            const event = new ShowToastEvent({
                title: 'Hurreeyyyy, Room Booked Succesfully🥂',
                title: result,

                variant: 'success',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
        }).catch(error=>{
            alert(error);
        })
    }
 }