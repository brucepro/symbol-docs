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

import {
    Account,
    AggregateTransaction,
    Deadline,
    MosaicDefinitionTransaction,
    MosaicFlags,
    MosaicId,
    MosaicNonce,
    MosaicSupplyChangeAction,
    MosaicSupplyChangeTransaction,
    NetworkType,
    RepositoryFactoryHttp,
    UInt64,
} from 'symbol-sdk';

/* start block 01 */
// replace with network type
const networkType = NetworkType.TEST_NET;
// replace with private key
const privateKey = '1111111111111111111111111111111111111111111111111111111111111111';
const account = Account.createFromPrivateKey(privateKey, networkType);
// replace with duration (in blocks)
const duration = UInt64.fromUint(0);
// replace with custom mosaic flags
const isSupplyMutable = true;
const isTransferable = true;
const isRestrictable = true;
// replace with custom divisibility
const divisibility = 0;

const nonce = MosaicNonce.createRandom();
const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
    Deadline.create(),
    nonce,
    MosaicId.createFromNonce(nonce, account.publicAccount),
    MosaicFlags.create(isSupplyMutable, isTransferable, isRestrictable),
    divisibility,
    duration,
    networkType);
/* end block 01 */

/* start block 02 */
// replace with mosaic units to increase
const delta = 1000000;

const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
    Deadline.create(),
    mosaicDefinitionTransaction.mosaicId,
    MosaicSupplyChangeAction.Increase,
    UInt64.fromUint(delta * Math.pow(10, divisibility)),
    networkType);
/* end block 02 */

/* start block 03 */
const aggregateTransaction = AggregateTransaction.createComplete(
    Deadline.create(),
    [
        mosaicDefinitionTransaction.toAggregate(account.publicAccount),
        mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)],
    networkType,
    [],
    UInt64.fromUint(2000000));

// replace with meta.networkGenerationHash (nodeUrl + '/node/info')
const networkGenerationHash = '4009619EB7A9F824C5D0EE0E164E0F99CCD7906A475D7768FD60B452204BD0A2';
const signedTransaction = account.sign(aggregateTransaction, networkGenerationHash);
// replace with node endpoint
const nodeUrl = 'http://api-01.ap-northeast-1.testnet-0951-v1.symboldev.network:3000';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();

transactionHttp
    .announce(signedTransaction)
    .subscribe((x) => console.log(x), (err) => console.error(err));
/* end block 03 */
