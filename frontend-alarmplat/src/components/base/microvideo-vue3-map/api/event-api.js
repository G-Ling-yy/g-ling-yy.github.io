/**
 * @description  事件api
 * @author       刘晖(liuh@microvideo.cn)
 * @date         2021/11/24 11:19
 */

import { createRequest } from '../lib/request';

export default {

    createEventMarker: (eventId) => {
        return createRequest().setParameters({eventId}).get("/zhdd/event/point")
    }

}
