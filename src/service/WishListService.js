import Rx from "rxjs/Rx";
import 'whatwg-fetch';
import * as firebase from 'firebase';
class WishListService {
    addToWishList(item)
    {
        item.timesteamp=firebase.database.ServerValue.TIMESTAMP;
        var newRef=firebase.database().ref("wishList").push();
        return newRef.set(item)
    }
    watchWishList()
    {
        return firebase.database().ref("wishList")
    }
}

export default new WishListService()
