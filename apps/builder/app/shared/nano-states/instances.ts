import { atom, computed } from "nanostores";
import { ROOT_INSTANCE_ID, type Instances } from "@webstudio-is/sdk";
import { rootComponent } from "@webstudio-is/react-sdk";
import type { InstanceSelector } from "../tree-utils";
import { $selectedPage } from "../awareness";

export const $isResizingCanvas = atom(false);

export const $selectedInstanceSelector = atom<undefined | InstanceSelector>(
  undefined
);

export const $editingItemSelector = atom<undefined | InstanceSelector>(
  undefined
);

export const $textEditingInstanceSelector = atom<
  | undefined
  | {
      selector: InstanceSelector;
      reason: "right" | "left" | "enter";
    }
  | {
      selector: InstanceSelector;
      reason: "click";
      mouseX: number;
      mouseY: number;
    }
  | {
      selector: InstanceSelector;
      reason: "up" | "down";
      cursorX: number;
    }
>();

export const $instances = atom<Instances>(new Map());

export const $virtualInstances = computed($selectedPage, (selectedPage) => {
  const virtualInstances: Instances = new Map();
  if (selectedPage) {
    virtualInstances.set(ROOT_INSTANCE_ID, {
      type: "instance",
      id: ROOT_INSTANCE_ID,
      component: rootComponent,
      children: [{ type: "id", value: selectedPage.rootInstanceId }],
    });
  }
  return virtualInstances;
});

export const $selectedInstance = computed(
  [$instances, $virtualInstances, $selectedInstanceSelector],
  (instances, virtualInstances, selectedInstanceSelector) => {
    if (selectedInstanceSelector === undefined) {
      return;
    }
    const [selectedInstanceId] = selectedInstanceSelector;
    return (
      instances.get(selectedInstanceId) ??
      virtualInstances.get(selectedInstanceId)
    );
  }
);

export const $synchronizedInstances = [
  ["textEditingInstanceSelector", $textEditingInstanceSelector],
  ["isResizingCanvas", $isResizingCanvas],
] as const;
