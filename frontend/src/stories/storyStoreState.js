export default {
    app: {
        isDrawerOpen: true,
        pageOptions: {},
        robots: [
            {
                healthStatus: {
                    limitFindingStatus: "not_run_yet",
                },
                id: "r2d2",
                lastKeepAliveReceivedAt: new Date(),
                model: "test",
                name: "R2-D2",
            },
            {
                healthStatus: {
                    limitFindingStatus: "ok",
                },
                id: "c3po",
                lastKeepAliveReceivedAt: new Date(),
                model: "test",
                name: "C-3PO",
            },
        ],
        selectedRobot: {
            healthStatus: {
                limitFindingStatus: "not_run_yet",
            },
            id: "r2d2",
            lastKeepAliveReceivedAt: new Date(),
            model: "test",
            name: "R2-D2",
        },
    },
};
