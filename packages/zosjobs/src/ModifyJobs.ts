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

import { AbstractSession, ImperativeExpect, Logger, Headers } from "@zowe/imperative";
import { JobsConstants } from "./JobsConstants";
import { ZosmfRestClient } from "@zowe/core-for-zowe-sdk";
import { IJob } from "./doc/response/IJob";
import { IModifyJobParms } from "./doc/input/IModifyJobParms";
import { IModifyJob } from "./doc/input/IModifyJob";
import { IJobFeedback } from "./doc/response/IJobFeedback";

/**
 * Class to handle modify of job class information
 * @export
 * @class ModifyJobs
 */
export class ModifyJobs {

    /**
     * Modify a job
     * @static
     * @param {AbstractSession} session - z/OSMF connection info
     * @param {string} jobname - job name to be translated into parms object
     * @param {string} jobid - job id to be translated into parms object
     * @param {string} jobclass - job class to be translated into parms object
     * @param {string} holdstatus - job status to be translated into parms object
     * @returns {Promise<undefined|IJobFeedback>} - promise of undefined, or IJobFeedback object returned by API if modifyVersion is 2.0
     * @memberof ModifyJobs
     */
    public static async modifyJob(session: AbstractSession, jobname: string, jobid: string, jobclass?: string, holdstatus?: string): Promise<undefined|IJobFeedback> {
        this.log.trace("ModifyJob called with jobname %s jobid %s", jobname, jobid);
        return ModifyJobs.modifyJobCommon(session, { jobname, jobid, jobclass, holdstatus });
    }

    /**
     * Modify a job
     * Alternative version of the modify API accepting an IJob object returned from other APIs such as GetJobs and SubmitJobs
     * @static
     * @param {AbstractSession} session - z/OSMF connection info
     * @param {IJob} job - the job that you want to modify
     * @returns {Promise<undefined|IJobFeedback>} - promise of undefined, or IJobFeedback object returned by API if modifyVersion is 2.0
     * @memberof ModifyJobs
     */
    public static async modifyJobForJob(session: AbstractSession, job: IJob ): Promise<undefined|IJobFeedback> {
        this.log.trace("ModifyJobForJob called with job %s", JSON.stringify(job));
        return ModifyJobs.modifyJobCommon(session, { jobname:job.jobname, jobid: job.jobid, jobclass: job.class, holdstatus: job.holdstatus });
    }

    /**
     * Modify a job
     * Full version of the API with a parameter object
     * @static
     * @param {AbstractSession} session - z/OSMF connection info
     * @param {IModifyJobParms} parms - parm object (see IModifyJobParms interface for details)
     * @returns {Promise<undefined|IJobFeedback>} - promise of undefined, or IJobFeedback object returned by API if modifyVersion is 2.0
     * @memberof ModifyJobs
     */
    public static async modifyJobCommon(session: AbstractSession, parms: IModifyJobParms): Promise<undefined|IJobFeedback> {
        this.log.trace("ModifyJobCommon called with parms %s", JSON.stringify(parms));
        ImperativeExpect.keysToBeDefinedAndNonBlank(parms, ["jobid"],
            "You must specify jobname and jobid for the job you want to modify.");
        this.log.info("Modifying job %s.%s", parms.jobname, parms.jobid);

        const headers: any = [Headers.APPLICATION_JSON];
        const parameters: string = "/" + parms.jobname + "/" + parms.jobid;
        let response: IJobFeedback;
        let request: IModifyJob;

        // build request to change class, if defined
        if (parms.jobclass != "undefined"){
            request = {
                class: parms.jobclass,
            };
            const responseJsonClass = await ZosmfRestClient.putExpectJSON(session, JobsConstants.RESOURCE + parameters, headers, request);
            response = responseJsonClass as IJobFeedback;
        }

        // build request to change holdStatus, if defined
        if (parms.holdstatus != "undefined"){
            request = {
                request: parms.holdstatus,
            };
            const responseJsonHold = await ZosmfRestClient.putExpectJSON(session, JobsConstants.RESOURCE + parameters, headers, request);
            response = responseJsonHold as IJobFeedback;
        }

        return response;

    }


    /**
     * Getter for brightside logger
     * @returns {Logger}
     */
    private static get log(): Logger {
        return Logger.getAppLogger();
    }
}
