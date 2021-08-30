<p align="center">
 <img width="20%" height="20%" src="elf.png">
</p>

# A Reactive State Management for JS Applications (WIP)

#### withStatus
This feature ensures that the store will include a status value. The value is either 'idle', 'pending' (the initial value), 'success', or 'error'. This will allow you to use the following methods, imported from the library:

withStatus - checks whether a status
selectStatus - returns an Observable that holds the store’s status and enables subscribing to it.
setStatus - set’s the store status
