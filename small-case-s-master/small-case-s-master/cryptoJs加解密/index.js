const CryptoJS = require('crypto-js');

// 密钥
const secretKey = 'v6p5Bzizrencaiya';
// 初始向量（IV），必须为128位或256位
const iv = 'R3vyY5JT';

/**
 * 解密函数
 * @param encodingText 加密的密文
 * @returns {*} 解密后的字符串
 */
function decoding (encodingText) {
    return CryptoJS.AES.decrypt(encodingText, CryptoJS.enc.Utf8.parse(secretKey), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
}

/**
 * 加密函数
 * @param content 要加密的字符串
 * @returns {*} 密文
 */
function encoding (content) {
    return CryptoJS.AES.encrypt(content, CryptoJS.enc.Utf8.parse(secretKey), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

// console.log('加密后的结果', encoding('200'));
console.log('解密后的结果', decoding('DoPVTBsP0y7OSzrn29fv4A'));