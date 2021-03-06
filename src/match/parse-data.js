/**
 * @description 把exp解析的内容反装回真是值
 */
import {
    getData,
    getArrData,
} from 'MATCH/parse';
import {
    isEmptyObj,
    typeCharge,
    objToArray,
} from 'LIB/util';
import {
    matchObject,
    matchArray,
} from 'MATCH/match';
import stack from 'MATCH/stack';
import config, { changeFilterDefaultObject } from 'MATCH/config';

const splStr = (
    str: Array,
    data: Object, // 映射的params数组
) => {
    const j = 0;
    // const item = str[i];
    const splData = (item) => {
        let result;

        if (item.matchParam) {
            result = getData(data, item.matchParam, item.matchType);
            return result;
        }

        if (item.matchArrParam) {
            result = getArrData(data, item.matchArrParam, item.matchType);
            return result;
        }

        if (item.default) {
            result = typeCharge(item.default);
            return result;
        }

        return result;
    };
    const datas = (i) => {
        const item = str[i];
        let result = splData(item);

        if (item.spr) {
            i++;
            switch (item.spr) {
            case '||':
                result =
                        (result === undefined) ? datas(i) : result;
                break;
            case '|||':
                result = result || datas(i);
                break;
            default:
                break;
            }
        }

        return result;
    };

    const results = datas(j);

    return results;
};

export default function (
    exp: Object, // parse 返回值
    data: Object, // 映射的params数组
    that: Object, // 返回对象指针
) {
    let result;

    try {
        if (exp.matchArrayKey) {
            result = data[exp.matchArrayKey];
            return result;
        }

        if (exp.matchObject) {
            result = matchObject(data, exp.matchObject);
            return result;
        }

        if (exp.matchArray) {
            result = matchArray(data, exp.matchArray);
            return result;
        }

        if (exp.noMatch !== undefined) {
            result = exp.noMatch;
            return result;
        }

        if (exp.matchFun) {
            result = exp.matchFun.apply(that, [data].concat(objToArray(stack, 'value')));
            return result;
        }

        if (exp.matchStr) {
            result = splStr(exp.matchStr, data);
            return result;
        }

        if (exp.matchParam) {
            result = getData(data, exp.matchParam, exp.matchType);
            result =
                (result === undefined) ? typeCharge(exp.default) : result;

            // 记录此时的空对象是默认产生的 防止被filter过滤
            if (isEmptyObj(result)) changeFilterDefaultObject(true);
            return result;
        }

        if (exp.matchArrParam) {
            result = getArrData(data, exp.matchArrParam, exp.matchType);
            result =
                (result === undefined) ? typeCharge(exp.default) : result;
            return result;
        }
    } catch (e) {
        if (exp.matchStr) {
            const def = exp.matchStr.pop();
            if (def.default) {
                result = typeCharge(def.default);
                return (config.filterDefaultObject && isEmptyObj(result)) ? undefined : result;
            }
        }
        // console.log(e);
    }

    return result;
}
