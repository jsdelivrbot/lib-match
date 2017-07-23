import { parse , parseToData } from 'MATCH/parse';
import {
    isFun,
    isObj,
    isArray
} from 'LIB/util';
import { pushStack } from 'MATCH/stack';


/**
 * 对象映射
 */
export const matchObject = function (
    data: any,
    obj: object
) {
    let exp;
    let result = {};
    for (let i in obj) {
        exp = parse(obj[i]);
        result[i] = parseToData(exp, data, result);
    }

    return result;
};

/**
 * 数组映射
 */
export const matchArray = function (
    data: any,
    arr: Array
) {
    let exp;
    let result = {};

    if (arr.length === 1) {
        // 直接映射 data
        for (let i = 0; i < data.length; i++) {
            result[i] = matchObject(data[i], arr[0]);
        }
    }

    if (arr.length === 2) {
        // 映射data的对象
        data= data[arr[0]];
        for (let i = 0; i < data.length; i++) {
            result[i] = matchObject(data[i], arr[1]);
        }
    }

    return result;
};

const match = {
    parse: (combineData, keyData) => {
        let matchData = {};
        let result;

        if (isObj(keyData)) {
            result = matchObject(combineData, keyData);
        }

        if (isArray(keyData)) {
            result = matchArray(combineData, keyData);
        }

        return result;
    },
    register: (
        obj: object | Array
    ) => {
        pushStack(obj);
    }
};

export default match;
