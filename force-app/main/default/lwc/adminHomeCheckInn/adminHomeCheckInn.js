import { LightningElement, track } from 'lwc';
import roomInfo from '@salesforce/apex/CheckInn.roomInfo';

const columns = [
    // { label: 'Reservation Name', fieldName: 'Name' },
    { label: 'Room Number', fieldName: 'Name'},
    // { label: 'Room', fieldName: 'Room__c' },
    { label: 'Room Type', fieldName: 'Room_Type__c'},
    { label: 'Rate', fieldName: 'Rate__c' },
    { label: 'Status', fieldName: 'Status__c' },
];


export default class AdminHomeCheckInn extends LightningElement {
    columnss = columns;
    column1 = columns;
    column2 = columns;

    @track rooms;
    @track AllRoom;
    @track availableRoom;
    @track aRoom;
    @track occupiedRooms;
    @track oRoom;
    connectedCallback(){
        this.roomInfo();
    }
    roomInfo(){
        roomInfo()
        .then(result=>{
            this.rooms = result;
            console.log('this.rooms',JSON.stringify(this.rooms))
            this.AllRoom = this.rooms.length;

            this.aRoom = this.rooms.filter((Aroom)=>Aroom.Status__c=="Available");
            console.log('aRoom', this.aRoom);
            this.availableRoom = this.aRoom.length;

            this.oRoom = this.rooms.filter(Orooms=>Orooms.Status__c=='Occupied');
            this.occupiedRooms = this.oRoom.length;

        }).catch(error=>{
            console.log(error);
        })
    }

    @track showAllRooms = false;
    handleAllRoomClick(){
        this.showAllRooms = true;
    }
    cancelAllRooms(){
        this.showAllRooms = false;
        this.showAvailableRooms = false;
        this.showOccupiedRooms = false;
    }

    @track showAvailableRooms = false;
    handleAvailableClick(){
        this.showAvailableRooms = true;
    }

    @track showOccupiedRooms = false;
    handleOccupiedRoom(){
        this.showOccupiedRooms = true;
    }

}