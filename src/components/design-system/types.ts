export interface ComponentDoc {
  id: string;
  name: string;
  description: string;
  category: string;
  component: React.ComponentType<any>;
  examples?: ComponentExample[];
  props?: PropDoc[];
}

export interface ComponentExample {
  name: string;
  description?: string;
  code: string;
  component: React.ComponentType<any>;
}

export interface PropDoc {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

// Cursor rules applied correctly.
