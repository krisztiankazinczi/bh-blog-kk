const SMALL_TAG = 3;
const MEDIUM_TAG = 6;

const smallFontSizeClassName = "small-font-size"
const mediumFontSizeClassName = "medium-font-size"
const bigFontSizeClassName = "big-font-size"

module.exports = function setSizeOfTags(tagsInPost, tags) {
  for (let i = 0; i < tagsInPost.length; i++) {
    for (let j = 0; j < tags.length; j++) {
      if (tagsInPost[i].tag_id === tags[j].id) {
        if (!tags[j]['size']) tags[j]['size'] = 1;
        else tags[j]['size'] += 1;
      } 
    } 
  }

  tags.map(tag => {
    if (tag.size <= SMALL_TAG) return tag.size = smallFontSizeClassName
    else if (tag.size <= MEDIUM_TAG) return tag.size = mediumFontSizeClassName
    if (tag.size > MEDIUM_TAG) return tag.size = bigFontSizeClassName
  })

  return tags;
}