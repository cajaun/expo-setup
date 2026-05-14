import React from "react";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import * as AC from "@bacons/apple-colors";
import * as Form from "@/components/ui/form";
import { metrics, updateApps } from "./constants";

export function FormShowcase() {
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [name, setName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("Campbell");

  return (
    <>
      <Form.Section
        title="Form controls"
        outerStyle={{ paddingHorizontal: 0 }}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: metrics.panelRadius,
        }}
        separatorInset="content"
      >
        <Form.TextField
          value={name}
          onChangeText={setName}
          placeholder="Display name"
          returnKeyType="done"
        />
        <Form.Toggle
          value={pushEnabled}
          onValueChange={setPushEnabled}
          hint={pushEnabled ? "On" : "Off"}
        >
          Push Notifications
        </Form.Toggle>
        <Form.Text hintBoolean={pushEnabled}>Notification status</Form.Text>
        <Form.Link
          href="/account"
          hint={name || "Not set"}
          systemImage={{ name: "person.crop.circle.fill", color: AC.systemIndigo }}
        >
          Account details
        </Form.Link>
      </Form.Section>

      <Form.Section
        title="Labeled inputs"
        footer="Use labeled inputs when a row needs a fixed label and editable value."
        outerStyle={{ paddingHorizontal: 0 }}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: metrics.panelRadius,
        }}
        separatorInset="content"
      >
        <Form.TextField
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Required"
          returnKeyType="next"
          inputStyle={{
            textAlign: "left",
          }}
        />
        <Form.TextField
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Required"
          returnKeyType="done"
          inputStyle={{
            textAlign: "left",
          }}
        />
      </Form.Section>

      <Form.Section
        title="Section styling"
        titleHint="custom surface"
        footer="Sections accept outerStyle, style, item padding, row height, and separator inset controls."
        outerStyle={{ paddingHorizontal: 0 }}
        style={{
          backgroundColor: "#f8f8f8",
          borderRadius: metrics.panelRadius,
        }}
        separatorInset="content"
      >
        <Form.Text
          systemImage={{ name: "rectangle.inset.filled", color: AC.systemOrange }}
          hint="outerStyle"
        >
          Flush outer padding
        </Form.Text>
        <Form.Text
          systemImage={{ name: "rectangle.roundedtop.fill", color: AC.systemPink }}
          hint="style"
        >
          Custom panel color and radius
        </Form.Text>
        <Form.Text
          systemImage={{ name: "list.bullet.indent", color: AC.systemGray }}
          hint="content"
        >
          Content separator inset
        </Form.Text>
      </Form.Section>

      <SeparatorInsetShowcase pushEnabled={pushEnabled} />
      <AccountFormShowcase />
    </>
  );
}

function SeparatorInsetShowcase({
  pushEnabled,
}: {
  readonly pushEnabled: boolean;
}) {
  return (
    <>
      <Form.Section
        title="Inset automatic"
        outerStyle={{ paddingHorizontal: 0 }}
        style={{ borderRadius: metrics.panelRadius }}
        separatorInset="automatic"
      >
        <Form.Text
          systemImage={{
            name: "text.alignleft",
            color: AC.systemIndigo,
          }}
          hint="Icon row"
        >
          Accounts for symbols
        </Form.Text>
        <Form.Text hint="Automatic">Uses the row shape</Form.Text>
        <Form.Link href="/" hint="Chevron">
          Link row
        </Form.Link>
      </Form.Section>

      <Form.Section
        title="Inset content"
        outerStyle={{ paddingHorizontal: 0 }}
        style={{ borderRadius: metrics.panelRadius }}
        separatorInset="content"
      >
        <Form.Text
          systemImage={{ name: "increase.indent", color: AC.systemBlue }}
          hint="Aligned"
        >
          Starts after content inset
        </Form.Text>
        <Form.Text hint="Clean edge">Good default for icon rows</Form.Text>
        <Form.Text hintBoolean={pushEnabled}>Boolean hint row</Form.Text>
      </Form.Section>

      <Form.Section
        title="Inset full"
        footer="Full separators work best when every row should read as one dense list."
        outerStyle={{ paddingHorizontal: 0 }}
        style={{ borderRadius: metrics.panelRadius }}
        separatorInset="full"
      >
        <Form.Text
          systemImage={{
            name: "rectangle.split.1x2.fill",
            color: AC.systemTeal,
          }}
          hint="Full width"
        >
          Separator spans the panel
        </Form.Text>
        <Form.Text hint="Dense">Useful for dense lists</Form.Text>
        <Form.Link href="/" hint="Full">
          Link row
        </Form.Link>
      </Form.Section>
    </>
  );
}

function AccountFormShowcase() {
  return (
    <Form.Section
      title="Upcoming automatic updates"
      outerStyle={{ paddingHorizontal: 0 }}
      style={{ borderRadius: metrics.panelRadius }}
      separatorInset="content"
    >
      <Form.Text hint="3 pending">Update All</Form.Text>
      {updateApps.map((app) => (
        <AppUpdate key={app.name} icon={app.icon} name={app.name} />
      ))}
    </Form.Section>
  );
}

function AppUpdate({
  icon,
  name,
}: {
  readonly icon: string;
  readonly name: string;
}) {
  return (
    <Form.HStack style={{ flex: 1, gap: 12 }}>
      <Image
        source={{ uri: icon }}
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
        }}
      />
      <Form.VStack>
        <Form.Text bold>{name}</Form.Text>
        <Form.Text
          style={{
            color: "#6e6e73",
            fontSize: 13,
          }}
        >
          Ready to install
        </Form.Text>
      </Form.VStack>
      <Form.Spacer />
      <Pressable
        accessibilityRole="button"
        style={{
          borderRadius: 999,
          backgroundColor: "rgba(0, 122, 255, 0.12)",
          paddingHorizontal: 14,
          paddingVertical: 7,
        }}
      >
        <Form.Text
          style={{
            color: "#007aff",
            fontFamily: "Sf-semibold",
            fontSize: 14,
          }}
        >
          Update
        </Form.Text>
      </Pressable>
    </Form.HStack>
  );
}
