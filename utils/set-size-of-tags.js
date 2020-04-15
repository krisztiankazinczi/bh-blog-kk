const SMALL_TAG = 3;
const MEDIUM_TAG = 6;

const smallFontSizeClassName = "small-font-size"
const mediumFontSizeClassName = "medium-font-size"
const bigFontSizeClassName = "big-font-size"

module.exports = function setSizeOfTags(tagsInPost, tags) {
  
  tagsInPost.forEach(postTag => tags.map(tag => {
    if (postTag.tag_id === tag.id) (!tag['size']) ? tag['size'] = 1 : tag['size'] += 1;
  }))

  tags.map(tag => {
    if (tag.size <= SMALL_TAG) return tag.size = smallFontSizeClassName
    else if (tag.size <= MEDIUM_TAG) return tag.size = mediumFontSizeClassName
    else if (tag.size > MEDIUM_TAG) return tag.size = bigFontSizeClassName
  })

  return tags;
}