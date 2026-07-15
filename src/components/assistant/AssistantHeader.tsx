import { Sparkles } from "lucide-react";

function AssistantHeader() {
  return (
    <div className="mb-10">

      <div className="flex items-center gap-3">

        <div
          className="
          w-14
          h-14
          rounded-2xl
          bg-gradient-to-br
          from-blue-500
          to-purple-600
          flex
          items-center
          justify-center
          text-white
          "
        >
          <Sparkles size={28}/>
        </div>

        <div>

          <h1 className="text-4xl font-bold text-white">
            SHIVIL AI Assistant
          </h1>

          <p className="text-slate-400 mt-2">
            Your intelligent university assistant.
          </p>

        </div>

      </div>

    </div>
  );
}

export default AssistantHeader;