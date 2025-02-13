/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { IOptions } from "../../../doc/IOptions";

/**
 * This interface defines the options that can be sent to get a data set or USS file function
 * @export
 * @interface IGetOptions
 */
export interface IGetOptions extends IOptions {

    /**
     * Range of records to return
     * @type {string}
     * @memberof IGetOptions
     */
    range?: string;
}

