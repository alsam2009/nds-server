import { Schema, model } from 'mongoose'

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    article_url: {
      type: String,
      required: true,
    },
    article_preview: {
      type: String,
    },
    publication_date: {
      type: String,
      required: true,
    },
    tag_article: {
      type: String,
      required: true,
    },
  },
);

newsSchema.method("toJSON", function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default model('News', newsSchema)
