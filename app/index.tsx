import React from "react";

import * as Form from "@/components/ui/form";
import { FormShowcase } from "@/components-showcase/home/form-showcase";
import { LaminarShowcase } from "@/components-showcase/home/laminar-showcase";
import { ToastShowcase } from "@/components-showcase/home/toast-showcase";

export default function Index() {
  return (
    <Form.List
      navigationTitle="Components"
      listStyle="grouped"
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 18,
      }}
    >
      <ToastShowcase />
      <LaminarShowcase />
      <FormShowcase />
    </Form.List>
  );
}
