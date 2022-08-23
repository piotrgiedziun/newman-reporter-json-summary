function createSummary(summary) {
    return [...new Map(summary.run.executions.map(item =>
        [item.id, item])).values()].map((e) => {
        return JSON.stringify({
            "type": "newman_test",
            "collection_name": summary.collection.name,
            "name": e.item?.name,
            "url": e.item?.request?.url?.path?.join("/"),
            "method": e.item?.request?.method,
            "responseTime": e.response?.responseTime,
            "responseCode": e.response?.code,
            "error": e.assertions.map(a => a.error).some(x => x)
        })
    })
}

module.exports = function(newman, options) {
    newman.on('beforeDone', function(err, data) {
        if (err) { return; }

        newman.exports.push({
            name: '@npm_identt/newman-reporter-log',
            default: 'summary.log',
            path:  options.logExport,
            content: `${createSummary(data.summary).join("\n")}\n`
        });
    });
};
