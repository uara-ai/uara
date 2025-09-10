"use client";

import { Button } from "@/components/ui/button";

// Helper function to render health-specific tools
export const renderHealthTool = (part: any, addToolResult: any) => {
  const callId = part.toolCallId;

  switch (part.type) {
    case "tool-analyzeLabResults":
      switch (part.state) {
        case "input-streaming":
          return <div>Loading lab analysis...</div>;
        case "input-available":
          return <div>Analyzing lab results for {part.input.testType}...</div>;
        case "output-available":
          return (
            <div>
              <h5 className="font-semibold">Lab Analysis Results:</h5>
              <p>{part.output}</p>
            </div>
          );
        case "output-error":
          return (
            <div className="text-red-600">
              Error analyzing labs: {part.errorText}
            </div>
          );
      }
      break;

    case "tool-getWhoopData":
      switch (part.state) {
        case "input-streaming":
          return <div>Connecting to Whoop...</div>;
        case "input-available":
          return <div>Fetching your Whoop data...</div>;
        case "output-available":
          return (
            <div>
              <h5 className="font-semibold">Whoop Data:</h5>
              <p>Recovery: {part.output.recovery}%</p>
              <p>HRV: {part.output.hrv}ms</p>
            </div>
          );
        case "output-error":
          return (
            <div className="text-red-600">
              Error fetching Whoop data: {part.errorText}
            </div>
          );
      }
      break;

    case "tool-calculateBioAge":
      switch (part.state) {
        case "input-streaming":
          return <div>Calculating biological age...</div>;
        case "input-available":
          return <div>Processing biomarkers...</div>;
        case "output-available":
          return (
            <div>
              <h5 className="font-semibold">Biological Age Analysis:</h5>
              <p>Estimated Bio Age: {part.output.bioAge} years</p>
              <p>Chronological Age: {part.output.chronoAge} years</p>
            </div>
          );
        case "output-error":
          return (
            <div className="text-red-600">
              Error calculating bio age: {part.errorText}
            </div>
          );
      }
      break;

    case "tool-askForConfirmation":
      switch (part.state) {
        case "input-streaming":
          return <div>Loading confirmation request...</div>;
        case "input-available":
          return (
            <div>
              <p className="mb-2">{part.input.message}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    addToolResult({
                      tool: "askForConfirmation",
                      toolCallId: callId,
                      output: "Yes, confirmed.",
                    })
                  }
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addToolResult({
                      tool: "askForConfirmation",
                      toolCallId: callId,
                      output: "No, denied",
                    })
                  }
                >
                  No
                </Button>
              </div>
            </div>
          );
        case "output-available":
          return (
            <div>
              <p>Confirmation result: {part.output}</p>
            </div>
          );
        case "output-error":
          return <div className="text-red-600">Error: {part.errorText}</div>;
      }
      break;
  }

  return null;
};

// Cursor rules applied correctly.
