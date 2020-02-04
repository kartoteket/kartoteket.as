// ref: https://www.sanity.io/docs/presenting-block-text
export default function blockToText(blocks = []) {
  return (
    blocks
      .map(block => {
        // if it's not a text block with children,
        // return nothing
        if (block._type !== 'block' || !block.children) {
          return '';
        }
        // loop through the children spans, and join the
        // text strings
        return block.children.map(child => child.text).join('');
      })
      // join the parapgraphs leaving split as space
      .join(' ')
  );
}
