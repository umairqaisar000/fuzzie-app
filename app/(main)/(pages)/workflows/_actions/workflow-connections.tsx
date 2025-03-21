'use server'
import { Option } from '@/components/ui/multiple-selector'
import { db } from '@/lib/db'
import { currentUser } from "@clerk/nextjs/server"

export const getGoogleListener = async () => {
    const authUser = await currentUser()

    if (authUser?.id) {
        const listener = await db.user.findUnique({
            where: {
                clerkId: authUser.id,
            },
            select: {
                googleResourceId: true,
            },
        })

        if (listener) return listener
    }
}

export const onFlowPublish = async (workflowId: string, state: boolean) => {
    console.log(state)
    const published = await db.workflows.update({
        where: {
            id: workflowId,
        },
        data: {
            publish: state,
        },
    })

    if (published.publish) return 'Workflow published'
    return 'Workflow unpublished'
}

export const onCreateNodeTemplate = async (
    content: string,
    type: string,
    workflowId: string,
    channels?: Option[],
    accessToken?: string,
    notionDbId?: string
) => {
    if (type === 'Discord') {
        const response = await db.workflows.update({
            where: {
                id: workflowId,
            },
            data: {
                discordTemplate: content,
            },
        })

        if (response) {
            return 'Discord template saved'
        }
    }
    if (type === 'Slack') {
        await db.workflows.update({
            where: {
                id: workflowId,
            },
            data: {
                slackTemplate: content,
                slackAccessToken: accessToken,
            },
        })

        if (type === "Slack") {

            // Update the Slack template and access token
            const response = await db.workflows.update({
                where: {
                    id: workflowId,
                },
                data: {
                    slackTemplate: content,
                    slackAccessToken: accessToken,
                },
            });

            if (response) {
                // Fetch the existing list of slackChannels
                const channelList = await db.workflows.findUnique({
                    where: {
                        id: workflowId,
                    },
                    select: {
                        slackChannels: true,
                    },
                });

                if (channelList) {
                    const existingChannels = channelList.slackChannels || [];

                    // Merge new channels with existing ones and remove duplicates
                    const allChannels = new Set([
                        ...existingChannels,
                        ...channels!.map((channel) => channel.value),
                    ]);

                    // Convert Set back to Array
                    const updatedChannels = Array.from(allChannels);

                    // Update the database with the deduplicated list
                    await db.workflows.update({
                        where: {
                            id: workflowId,
                        },
                        data: {
                            slackChannels: updatedChannels,
                        },
                    });

                    return "Slack template saved";
                }
            }
        }
    }

    if (type === 'Notion') {
        const response = await db.workflows.update({
            where: {
                id: workflowId,
            },
            data: {
                notionTemplate: content,
                notionAccessToken: accessToken,
                notionDbId: notionDbId,
            },
        })

        if (response) return 'Notion template saved'
    }
}

export const onGetWorkflows = async () => {
    const user = await currentUser()
    if (user) {
        const workflow = await db.workflows.findMany({
            where: {
                userId: user.id,
            },
        })

        if (workflow) return workflow
    }
}

export const onCreateWorkflow = async (name: string, description: string) => {
    const user = await currentUser()

    if (user) {
        //create new workflow
        const workflow = await db.workflows.create({
            data: {
                userId: user.id,
                name,
                description,
            },
        })

        if (workflow) return { message: 'workflow created' }
        return { message: 'Oops! try again' }
    }
}

export const onGetNodesEdges = async (flowId: string) => {
    const nodesEdges = await db.workflows.findUnique({
        where: {
            id: flowId,
        },
        select: {
            nodes: true,
            edges: true,
        },
    })
    if (nodesEdges?.nodes && nodesEdges?.edges) return nodesEdges
}