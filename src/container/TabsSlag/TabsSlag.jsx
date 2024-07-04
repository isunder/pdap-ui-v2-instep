import { useSelector } from "react-redux";

export const TabsSlag = () => {
    const state = useSelector(state => state.user.data.tabs);
    let obj = state && state?.reduce(function (acc, cur) {
        let str = (cur.name)?.split('_');
        str?.shift();
        let newStr = str?.join('_');
        acc[newStr] = cur;
        return acc;
    }, {});
    return obj === 'undefined' ? {} : obj;
};