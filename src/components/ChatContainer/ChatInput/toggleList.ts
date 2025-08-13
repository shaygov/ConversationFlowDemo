import { NodeType } from 'prosemirror-model';
import { wrapInList, liftListItem, splitListItem } from 'prosemirror-schema-list';
import { Command } from 'prosemirror-state';

export function toggleList(listType: NodeType, itemType: NodeType): Command {
  return function(state, dispatch, view) {
    const { $from, $to } = state.selection;
    let range = $from.blockRange($to);
    if (!range) return false;
    const parentList = range.parent.type === listType;
    if (parentList) {
      // If already in list, lift out
      return liftListItem(itemType)(state, dispatch);
    } else {
      // Otherwise, wrap in list
      return wrapInList(listType)(state, dispatch);
    }
  };
} 