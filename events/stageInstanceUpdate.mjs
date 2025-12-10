// events/stageInstanceUpdate.mjs
export default async function ({ log }, oldStageInstance, newStageInstance) {
    log.debug('stageInstanceUpdate', { oldStageInstance, newStageInstance });
}
