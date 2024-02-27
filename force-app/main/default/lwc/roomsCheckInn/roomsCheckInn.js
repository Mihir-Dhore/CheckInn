import { LightningElement, track,api } from 'lwc';
import roomInfo from '@salesforce/apex/CheckInn.roomInfo';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BookWithRelatedAccount from '@salesforce/apex/CheckInn.BookWithRelatedAccount';
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
    
    //To insert Reservation
    @track name;
    handleNameChange(event){
        this.name = event.target.value;
        console.log(this.name)
    }
    @track totalMember;
    handletotalMemberChange(event){
        this.totalMember = event.target.value;
    }
    @track checkInDate;
    handleCheckInDateTimeChange(event){
        this.checkInDate = event.target.value;
        console.log(this.checkInDate)
        this.validateDates();

    }
    @track checkOutDate;
    handleCheckOutDateTimeChange(event){
        this.checkOutDate = event.target.value;
        this.validateDates();

    }
    @track totalAmount;
    handletotalAmountChange(event){
        this.totalAmount = event.target.value;
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
            //To Make field required

            let isValid = true;
            this.template.querySelectorAll("lightning-input").forEach(item=>{
                let fieldValue = item.value;
                let fieldLabel = item.label;
                let fieldError = 'Please Enter the';

                if(!fieldValue){
                    isValid = false;
                    item.setCustomValidity(fieldError + " " + fieldLabel);
                }else{
                    item.setCustomValidity("");
                }
                item.reportValidity();
            });
            if(!isValid){
                return;
            }
            
        if (this.costValue != this.roomRate) {
            console.log('this.costValue',this.costValue)
            console.log('this.roomRate',this.roomRate)


            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Pay '+ this.roomRate + ' only',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
        } else {
            BookWithRelatedAccount({ roomId: this.roomId, name:this.name,totalMember: this.totalMember,checkInDate:this.checkInDate, checkOutDate:this.checkOutDate, costValue:this.costValue })
                .then(result => {
                    console.log(result);
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