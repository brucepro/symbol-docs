"use strict";
/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const symbol_sdk_1 = require("symbol-sdk");
/* start block 01 */
// replace with network type
const networkType = symbol_sdk_1.NetworkType.TEST_NET;
// replace with bob private key
const bobPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';
const bobAccount = symbol_sdk_1.Account.createFromPrivateKey(bobPrivateKey, networkType);
// replace with alice public key
const alicePublicKey = 'E59EF184A612D4C3C4D89B5950EB57262C69862B2F96E59C5043BF41765C482F';
const alicePublicAccount = symbol_sdk_1.PublicAccount.createFromPublicKey(alicePublicKey, networkType);
// replace with node endpoint
const nodeUrl = 'http://api-01.ap-northeast-1.testnet-0951-v1.symboldev.network:3000';
const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
const metadataHttp = repositoryFactory.createMetadataRepository();
// replace with key and new value
const key = symbol_sdk_1.KeyGenerator.generateUInt64Key('CERT');
const newValue = '000000';
const newValueBytes = symbol_sdk_1.Convert.utf8ToUint8(newValue);
const accountMetadataTransaction = metadataHttp.getAccountMetadataByKeyAndSender(alicePublicAccount.address, 'CERT', bobAccount.publicKey)
    .pipe(operators_1.mergeMap((metadata) => {
    const currentValueBytes = symbol_sdk_1.Convert.utf8ToUint8(metadata.metadataEntry.value);
    return rxjs_1.of(symbol_sdk_1.AccountMetadataTransaction.create(symbol_sdk_1.Deadline.create(), alicePublicAccount.publicKey, key, newValueBytes.length - currentValueBytes.length, symbol_sdk_1.Convert.decodeHex(symbol_sdk_1.Convert.xor(currentValueBytes, newValueBytes)), networkType));
}));
/* end block 01 */
