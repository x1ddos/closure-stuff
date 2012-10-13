COMPILER_SRC_DIR := $(HOME)/src/closure/compiler
CLOSURE_SRC_DIR  := $(HOME)/src/closure/library

JS_BUILDER      := $(CLOSURE_SRC_DIR)/closure/bin/build/closurebuilder.py
JS_DEPSWRITER   := $(CLOSURE_SRC_DIR)/closure/bin/build/depswriter.py
COMPILER_JAR    := $(COMPILER_SRC_DIR)/build/compiler.jar

SRC_DIR         := src
BUILD_DIR       := build

default: help
help:
	@echo
	@echo "This makefile is here only to build standalone versions."
	@echo "See targets for what this can build.\n"

OUTMODE=compiled
js_htmleditor: _ensure_build_dir
	$(JS_BUILDER) -c $(COMPILER_JAR) \
		--root=$(CLOSURE_SRC_DIR) \
		--root=$(SRC_DIR) \
		-i $(SRC_DIR)/nodeps.htmleditor.js \
		-f "--flagfile=commonflags_js.txt" \
		-f "--js=$(CLOSURE_SRC_DIR)/closure/goog/deps.js" \
		-f "--externs=$(COMPILER_SRC_DIR)/contrib/externs/google_loader_api.js" \
		-f "--externs=externs/googleapis.js" \
		-f "--create_source_map=$(BUILD_DIR)/nodeps.htmleditor.mapv3.js" \
		-o $(OUTMODE) > $(BUILD_DIR)/nodeps.htmleditor.min.js

jsdeps_for_demos:
	$(JS_DEPSWRITER) --root_with_prefix="$(SRC_DIR) ../src/" > demos/deps.js

serve_demos:
	python -m SimpleHTTPServer

_ensure_build_dir:
	@mkdir -p $(BUILD_DIR)

clean:
	rm -rf $(BUILD_DIR)
