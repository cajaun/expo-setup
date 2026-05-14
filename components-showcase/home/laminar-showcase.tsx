import React from "react";
import * as AC from "@bacons/apple-colors";
import { Laminar } from "react-native-laminar";

import { PressableScale } from "@/components/ui/utils/pressable-scale";
import * as Form from "@/components/ui/form";
import { metrics } from "./constants";

type SimulationLabel =
  | "Run Simulation"
  | "Running Simulation"
  | "Simulation Done!";

export function LaminarShowcase() {
  const [word, setWord] = React.useState("Laminar");
  const [amount, setAmount] = React.useState("$1,234");
  const [simulationLabel, setSimulationLabel] =
    React.useState<SimulationLabel>("Run Simulation");

  function runSimulation() {
    setSimulationLabel((current) => {
      if (current === "Run Simulation") {
        return "Running Simulation";
      }

      if (current === "Running Simulation") {
        return "Simulation Done!";
      }

      return "Run Simulation";
    });
  }

  return (
    <Form.Section
      title="Laminar"
      outerStyle={{ paddingHorizontal: 0 }}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: metrics.panelRadius,
      }}
      separatorInset="content"
    >
      <Form.FormItem
        style={{
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: 12,
        }}
      >
        <Laminar
          text={word}
          align="center"
          autoSize={false}
          fontSize={40}
          animationPreset="smooth"
          containerStyle={{
            width: "100%",
            height: 52,
          }}
          style={{
            color: "#111111",
            fontFamily: "Sf-bold",
          }}
        />
      </Form.FormItem>
      <Form.Text
        systemImage={{ name: "textformat", color: AC.systemBlue }}
        hint="Text"
        onPress={() =>
          setWord((current) => (current === "Laminar" ? "Linear" : "Laminar"))
        }
      >
        Morph word
      </Form.Text>

      <Form.FormItem
        style={{
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: 12,
        }}
      >
        <Laminar
          text={amount}
          variant="number"
          align="center"
          autoSize={false}
          fontSize={40}
          animationPreset="snappy"
          containerStyle={{
            width: 220,
            height: 52,
          }}
          style={{
            color: "#111111",
            fontFamily: "Sf-bold",
            fontVariant: ["tabular-nums"],
          }}
        />
      </Form.FormItem>
      <Form.Text
        systemImage={{ name: "number", color: AC.systemGreen }}
        hint="Number"
        onPress={() =>
          setAmount((current) =>
            current === "$1,234" ? "$12,345" : "$1,234"
          )
        }
      >
        Change amount
      </Form.Text>

      <Form.FormItem
        style={{
          paddingHorizontal: 16,
          paddingVertical: 14,
        }}
      >
        <PressableScale
          onPress={runSimulation}
          className="rounded-full"
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 50,
            backgroundColor: "#111111",
            paddingHorizontal: 20,
          }}
        >
          <Laminar
            text={simulationLabel}
            align="center"
            autoSize={false}
            containerStyle={{ width: "100%" }}
            style={{
              color: "#ffffff",
              fontFamily: "Sf-bold",
              fontSize: 20,
            }}
          />
        </PressableScale>
      </Form.FormItem>
    </Form.Section>
  );
}
