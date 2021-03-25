#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { ValheimServerAwsCdkStack } from "../lib/valheim-server-aws-cdk-stack";
import { LambdaEcsFargateUpdownstatusStack } from '../lib/lambda-ecs-fargate-updownstatus-stack';

class ValheimServerProps {
    addAppGatewayStartStopStatus: boolean;
}

class ValheimServer extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string, props?: ValheimServerProps) {
        super(scope, id);
        var ecsStack = new ValheimServerAwsCdkStack(app, "ValheimServerAwsCdkStack");
        if( props?.addAppGatewayStartStopStatus )
        {
            var lambdaStack = new LambdaEcsFargateUpdownstatusStack(app, 'LambdaEcsFargateUpdownstatusStack', {
                serviceArn: cdk.Fn.importValue("fargateServiceName"),
                clusterArn: cdk.Fn.importValue("fargateClusterName"),
                startStopPassword: "changeme",
            });
            lambdaStack.addDependency(ecsStack);
        }
    }
}

const app = new cdk.App();
new ValheimServer(app, "ValheimServer", {addAppGatewayStartStopStatus: true});
app.synth();
