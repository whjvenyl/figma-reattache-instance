function reattachInstance() {
    let skippedCount = 0;
    let processedCount = 0;
    let originalInstances = {};

    if (figma.currentPage.selection.length == 0) {
        return "Please, select a frame first";
    }

    const clonedSelection = Object.assign([], figma.currentPage.selection);

    for (let index in clonedSelection) {
        let frame = clonedSelection[index];
        let instanceReference;

        if (frame.type !== "FRAME") {
          skippedCount += 1;
          continue
        }

        if (!(frame.name in originalInstances)) {
            instanceReference= figma.currentPage.findOne(node => node.type === "INSTANCE" && node.name == frame.name) as InstanceNode;
            originalInstances[frame.name] = instanceReference;
        } else {
            instanceReference = originalInstances[frame.name];
        }

        if (instanceReference != null) {
            let instanceClone = instanceReference.masterComponent.createInstance();
            frame.parent.appendChild(instanceClone);
            instanceClone.x = frame.x;
            instanceClone.y = frame.y;
            instanceClone.resize(frame.width, frame.height);
            frame.remove();
            processedCount += 1;
            continue;
        }
        skippedCount += 1;
        continue;
    }

    return `${processedCount} processed, ${skippedCount} skipped`;
}

figma.closePlugin(reattachInstance());
