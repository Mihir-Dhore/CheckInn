trigger CheckInnBookRoomStatus on Reservation__c (after Insert, after Update) {
    //To updates room status to 'Occupied' for confirmed reservations and 'Available' for pending or canceled reservations in response to new reservations or updates.
    List<Room__c> updateRoom = new List<Room__c>();
    for(Reservation__c res:Trigger.New){
        if(Trigger.isAfter && Trigger.isInsert ||(Trigger.isUpdate)){
            Room__c room = new Room__c();
            if(res.Status__c == 'Confirmed'){
                room.Status__c = 'Occupied';
                room.Id = res.Room__c;
                updateRoom.add(room);  
            }else if(res.Status__c =='Pending' || res.Status__c =='Canceled'){
                room.Status__c = 'Available';
                room.Id = res.Room__c;
                updateRoom.add(room);  
            }
        }
    }
    if(!updateRoom.isEmpty()){
        update updateRoom;
    }
    
}