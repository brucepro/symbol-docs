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
const symbol_sdk_1 = require("symbol-sdk");
// replace network type
const networkType = symbol_sdk_1.NetworkType.TEST_NET;
// replace with cosignatory private key
const cosignatoryPrivateKey = '0000000000000000000000000000000000000000000000000000000000000000';
const cosignatoryAccount = symbol_sdk_1.Account.createFromPrivateKey(cosignatoryPrivateKey, networkType);
// replace with multisig account public key
const multisigAccountPublicKey = '3A537D5A1AF51158C42F80A199BB58351DBF3253C4A6A1B7BD1014682FB595EA';
const multisigAccount = symbol_sdk_1.PublicAccount.createFromPublicKey(multisigAccountPublicKey, networkType);
// replace with recipient address
const recipientRawAddress = 'TCVQ2R-XKJQKH-4RJZWG-DARWJ6-V4J4W7-F4DGH6-ZFAB';
const recipientAddress = symbol_sdk_1.Address.createFromRawAddress(recipientRawAddress);
// replace with symbol.xym id
const networkCurrencyMosaicId = new symbol_sdk_1.MosaicId('51A99028058245A8');
// replace with network currency divisibility
const networkCurrencyDivisibility = 6;
const transferTransaction = symbol_sdk_1.TransferTransaction.create(symbol_sdk_1.Deadline.create(), recipientAddress, [new symbol_sdk_1.Mosaic(networkCurrencyMosaicId, symbol_sdk_1.UInt64.fromUint(10 * Math.pow(10, networkCurrencyDivisibility)))], symbol_sdk_1.PlainMessage.create('sending 10 symbol.xym'), networkType);
/* start block 01 */
const aggregateTransaction = symbol_sdk_1.AggregateTransaction.createBonded(symbol_sdk_1.Deadline.create(), [transferTransaction.toAggregate(multisigAccount)], networkType);
// replace with meta.networkGenerationHash (nodeUrl + '/node/info')
const networkGenerationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
const signedTransaction = cosignatoryAccount.sign(aggregateTransaction, networkGenerationHash);
console.log(signedTransaction.hash);
/* end block 01 */
/* start block 02 */
const hashLockTransaction = symbol_sdk_1.HashLockTransaction.create(symbol_sdk_1.Deadline.create(), new symbol_sdk_1.Mosaic(networkCurrencyMosaicId, symbol_sdk_1.UInt64.fromUint(10 * Math.pow(10, networkCurrencyDivisibility))), symbol_sdk_1.UInt64.fromUint(480), signedTransaction, networkType, symbol_sdk_1.UInt64.fromUint(2000000));
const signedHashLockTransaction = cosignatoryAccount.sign(hashLockTransaction, networkGenerationHash);
// replace with node endpoint
const nodeUrl = 'http://api-01.ap-northeast-1.testnet-0951-v1.symboldev.network:3000';
const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
const listener = repositoryFactory.createListener();
const receiptHttp = repositoryFactory.createReceiptRepository();
const transactionHttp = repositoryFactory.createTransactionRepository();
const transactionService = new symbol_sdk_1.TransactionService(transactionHttp, receiptHttp);
listener.open().then(() => {
    transactionService
        .announceHashLockAggregateBonded(signedHashLockTransaction, signedTransaction, listener)
        .subscribe((x) => console.log(x), (err) => console.log(err), () => listener.close());
});
/* end block 02 */
