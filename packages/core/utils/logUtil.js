import {UAParser} from "ua-parser-js";
import { v4 as uuidv4 } from 'uuid'
import * as logApi from "../api/web/log.js";

/**
 * 获取设备信息
 */
export function getUAParser() {
    return UAParser()
}

/**
 * 获取页签id
 */
export function getTabId() {
    let uuid = sessionStorage.getItem('Tab-Id');
    if (!uuid) {
        uuid = uuidv4();
        sessionStorage.setItem('Tab-Id', uuid)
    }
    return uuid
}

/**
 * 记录日志
 * @param data
 * eventType  // 事件类型1-加载页面，2点击按钮
 * eventCode  // 事件编码，定位按钮用
 * eventDesc  // 编码描述
 */
export function sendLog(data = {}) {
    if (process.server) {
        return
    }

    const UAParserData = UAParser() || {}
    const params = Object.assign({}, data, {
        url: location.href,
        // js是否开启 0禁用1开启
        jsEnabled: navigator.javaEnabled() ? 1 : 0,
        // 访问浏览器名称
        browserName: UAParserData.browser?.name,
        // 访问浏览器版本
        browserMajor: UAParserData.browser?.major,
        // 访问设备类型
        deviceType: UAParserData.device?.type,
        // 访问设备品牌
        deviceModel: UAParserData.device?.model,
        // 访问设备厂商
        deviceVendor: UAParserData.device?.vendor,
        // 设备OS名称
        osName: UAParserData.os?.name,
        // 设备OS版本
        osVersion: UAParserData.os?.version,
        // 访问设备屏幕尺寸
        deviceResolution: '',
        // 设备时间
        deviceTime: '',
    })

    logApi.pageViewLogAdd(params).then(res => {})
}