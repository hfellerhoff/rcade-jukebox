import {
  createSignal,
  createEffect,
  onMount,
  For,
  type Component,
} from "solid-js";
import { songs, type Slot } from "./songs";
import { on } from "@rcade/plugin-input-classic";
import clsx from "clsx";

const MAX_SONGS = 16;
const BUTTON_COUNT = 11;

const getAudioElementIdFromSongId = (id: number) => `song-${id}`;

const App: Component = () => {
  const [displayText, setDisplayText] = createSignal("");
  const [selectedButtonIndex, setSelectedButtonIndex] = createSignal(0);

  const [audioElement, setAudioElement] = createSignal(null);

  const [slots, setSlots] = createSignal<(null | Slot)[]>(
    new Array(MAX_SONGS).fill(null).map((x, i) => ({
      id: 100 + i,
      name: null,
      artist: null,
    })),
  );

  const stopPlayback = () => {
    setDisplayText("");

    console.log("hi");
    console.log(audioElement());

    audioElement().pause();
    audioElement().currentTime = 0;
    setAudioElement(null);
  };

  createEffect(() => {
    if (displayText().length === 3 && !audioElement()) {
      const newAudioElement = document.querySelector(
        `#${getAudioElementIdFromSongId(parseInt(displayText()))}`,
      );

      if (newAudioElement) {
        newAudioElement.play();
        setAudioElement(newAudioElement);
      }
    }
  });

  const onNumberInput = (x: number) => {
    setDisplayText((prevText) => {
      let newText = prevText;
      if (prevText.length < 3) {
        newText += x;
      }

      return newText;
    });
  };

  onMount(() => {
    setSlots((prevSlots) => {
      return prevSlots.map((slot, slotIndex) => {
        const song = songs.find((s) => s.id === slot.id);
        return song ?? slot;
      });
    });

    on("inputStart", (input) => {
      if (input.button === "LEFT") {
        setSelectedButtonIndex((prevIndex) => {
          if (prevIndex === 0) {
            return BUTTON_COUNT - 1;
          }
          return prevIndex - 1;
        });
      }
      if (input.button === "RIGHT") {
        setSelectedButtonIndex((prevIndex) => {
          if (prevIndex === BUTTON_COUNT - 1) {
            return 0;
          }
          return prevIndex + 1;
        });
      }
      if (input.button === "A") {
        if (selectedButtonIndex() < 10) {
          onNumberInput((selectedButtonIndex() + 1) % 10);
        }
        if (selectedButtonIndex() === 10) {
          setDisplayText("");
          if (audioElement()) {
            stopPlayback();
          }
        }
      }
      // console.log(input);
    });
  });

  return (
    <>
      <main>
        <div id="jukebox-border">
          <div id="jukebox-main">
            <For each={slots()}>
              {(item, index) => (
                <div
                  class={clsx("slot", {
                    "slot-playing":
                      item.id === parseInt(displayText()) && !!audioElement(),
                  })}
                >
                  <div class="slot-id">{item.id}</div>
                  <div class="slot-metadata">
                    <div class="slot-title">{item.name ?? "Empty"}</div>
                    <div class="slot-artist">{item.artist ?? "Empty"}</div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
        <div id="jukebox-controls">
          <div id="jukebox-controls-display">#{displayText()}</div>
          <br />
          <button
            class={clsx("number-button", {
              "selected-button": selectedButtonIndex() === 0,
            })}
          >
            1
          </button>
          <button
            class={clsx("number-button", {
              "selected-button": selectedButtonIndex() === 1,
            })}
          >
            2
          </button>
          <button
            class={clsx("number-button", {
              "selected-button": selectedButtonIndex() === 2,
            })}
          >
            3
          </button>
          <button
            class={clsx("number-button", {
              "selected-button": selectedButtonIndex() === 3,
            })}
          >
            4
          </button>
          <button
            class={clsx("number-button", {
              "selected-button": selectedButtonIndex() === 4,
            })}
          >
            5
          </button>
          <button
            class={clsx("number-button", {
              "selected-button": selectedButtonIndex() === 5,
            })}
          >
            6
          </button>
          <button
            class={clsx("number-button", {
              "selected-button": selectedButtonIndex() === 6,
            })}
          >
            7
          </button>
          <button
            class={clsx("number-button", {
              "selected-button": selectedButtonIndex() === 7,
            })}
          >
            8
          </button>
          <button
            class={clsx("number-button", {
              "selected-button": selectedButtonIndex() === 8,
            })}
          >
            9
          </button>
          <button
            class={clsx("number-button", {
              "selected-button": selectedButtonIndex() === 9,
            })}
          >
            0
          </button>
          <br />
          <button
            class={clsx("text-button", {
              "selected-button": selectedButtonIndex() === 10,
            })}
          >
            RESET
          </button>
        </div>
      </main>
      <For each={slots()}>
        {(item, index) => {
          if (!item.src) return null;
          return (
            <audio
              id={getAudioElementIdFromSongId(item.id)}
              src={`/songs/${item.src}`}
              loop={false}
              onended={stopPlayback}
            />
          );
        }}
      </For>
    </>
  );
};

export default App;
