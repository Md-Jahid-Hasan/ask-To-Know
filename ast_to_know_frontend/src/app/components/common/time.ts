import moment from "moment";

export function getTimeDifference(time:string) {
        return moment(time).fromNow()
}

// export default getTimeDifference(time: string) {
//         return moment(time).fromNow()
//     }
