export interface FormValidators {
  maxlength: number;
  required: boolean;
}

export interface PostsValidators {
  title: FormValidators;
  content: FormValidators;
}

export interface CommentsValidators {
  content: FormValidators;
}

export interface PostsDefaults {
  title: string;
  content: string;
}

export interface CommentsDefaults {
  content: string;
}

export interface Forms {
  posts: {
    validators: Readonly<PostsValidators>;
    defaults: Readonly<PostsDefaults>;
    batchSize: number;
  };
  comments: {
    validators: Readonly<CommentsValidators>;
    defaults: Readonly<CommentsDefaults>;
    batchSize: number;
  };
}

export interface Config {
  forms: Forms;
}
