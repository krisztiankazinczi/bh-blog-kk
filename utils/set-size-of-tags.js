const SMALL_TAG = 3;
const MEDIUM_TAG = 6;

const smallFontSizeClassName = "small-font-size"
const mediumFontSizeClassName = "medium-font-size"
const bigFontSizeClassName = "big-font-size"

module.exports = function setSizeOfTags(tagsInPost, tags) {
  
  tagsInPost.forEach(postTag => tags.map(tag => {
    if (postTag.tag_id === tag.id) {
      (!tag['size']) ? tag['size'] = 1 : tag['size'] += 1;
    } 
  }))

  tags.forEach(tag => {
    if (tag.size <= SMALL_TAG) tag.size = smallFontSizeClassName
    if (tag.size <= MEDIUM_TAG) tag.size = mediumFontSizeClassName
    if (tag.size > MEDIUM_TAG) tag.size = bigFontSizeClassName
  })

  return tags;
}