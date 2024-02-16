import { LightningElement, track,api } from 'lwc';
import roomInfo from '@salesforce/apex/CheckInn.roomInfo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BookRelatedToRoom from '@salesforce/apex/CheckInn.BookRelatedToRoom';
import fetchRoomRate from '@salesforce/apex/CheckInn.fetchRoomRate';

export default class RoomsCheckInn extends LightningElement {

    connectedCallback(){
        this.fetchavailableroom();
        // this.roomDetails();
    }

    //Filter and button condition - Start
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
                    this.rooms = this.AvailableRooms;
                    // console.log('AvailableRooms',this.rooms);
                }
            //  console.log('length', this.rooms.length);   
               
            })
            .catch((error) => {
                alert(error.body.message);
            });
    }
    //Filter and button condition - End


    //Book Button Operation
    @track SingleColor;
    @track singleColors;
    @track StoreRoomType = '';
    OnClickRoomTypes(event) {
        const Roomtype = event.currentTarget.dataset.name;
        console.log('Room type',Roomtype)
        this.StoreRoomType = Roomtype;
        console.log('StoreRoomType',this.StoreRoomType)
        this.fetchavailableroom();

      
        if(Roomtype == this.StoreRoomType){
            this.SingleColor = singleColors ;
        }
    }
    
    @track roomId;
    @track roomRate;
    @track openBookModal = false;
    handleBookRoomClick(event){
        const recordId = event.currentTarget.dataset.id;
        console.log('room ID',recordId);
        this.roomId = recordId;
        // console.log('Rate daataa',JSON.stringify(this.rooms));
        this.openBookModal = true;

        fetchRoomRate({roomId:this.roomId})
        .then(result=>{
            console.log('this.roomRateREsult ',result)
             const rr = result.forEach(item=>{
                this.roomRate = item.Rate__c;
                console.log('this.roomRate rr',rr)
            });
        }).catch(error=>{
            console.log(error);
        })
    }
    handleBookCancelButton(){
        this.openBookModal = false;
    }

    
    //Total Cost Validation
    @track costValue;
    handleTotalCostChange(event){
        this.costValue = event.target.value;
        console.log(this.costValue);
    }

    handleSubmitBookRoomClick() {
        if (this.costValue != this.roomRate) {
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Pay '+ this.roomRate + ' only',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
        } else {
            BookRelatedToRoom({ roomId: this.roomId })
                .then(result => {
                    const successEvent = new ShowToastEvent({
                        title: 'Success',
                        message: 'Room Booked Successfully 🥂',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(successEvent);
                })
                .catch(error => {
                    const errorEvent = new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(errorEvent);
                });
        }
    }
}