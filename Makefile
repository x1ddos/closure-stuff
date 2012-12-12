COMPILER_SRC_DIR := $(HOME)/src/closure/compiler
CLOSURE_SRC_DIR  := $(HOME)/src/closure/library
GSS_JAR          := $(HOME)/src/closure/gss/build/closure-stylesheets.jar

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
js_htmleditor: _ensure_build_dir css_htmleditor
	$(JS_BUILDER) -c $(COMPILER_JAR) \
		--root=$(CLOSURE_SRC_DIR) \
		--root=$(SRC_DIR) \
		-i $(SRC_DIR)/nodeps.htmleditor.js \
		-f "--flagfile=commonflags_js.txt" \
		-f "--js=$(CLOSURE_SRC_DIR)/closure/goog/deps.js" \
		-f "--js=$(BUILD_DIR)/htmleditor.cssmap.js" \
		-f "--externs=$(COMPILER_SRC_DIR)/contrib/externs/google_loader_api.js" \
		-f "--externs=externs/googleapis.js" \
		-f "--create_source_map=$(BUILD_DIR)/nodeps.htmleditor.mapv3.js" \
		-o $(OUTMODE) > $(BUILD_DIR)/nodeps.htmleditor.min.js

css_htmleditor: _ensure_build_dir
	java -jar $(GSS_JAR) \
		--output-renaming-map $(BUILD_DIR)/htmleditor.cssmap.js \
		--output-renaming-map-format CLOSURE_COMPILED \
		--rename CLOSURE \
		$(SRC_DIR)/gss/_defs.gss \
		$(SRC_DIR)/gss/_mixins.gss \
		$(SRC_DIR)/gss/base.gss \
		$(SRC_DIR)/gss/buttons.gss \
		$(SRC_DIR)/gss/dialogs.gss \
		$(SRC_DIR)/gss/menus.gss \
		$(SRC_DIR)/gss/palettes.gss \
		$(SRC_DIR)/gss/tabbars.gss \
		$(SRC_DIR)/gss/toolbars.gss \
		$(SRC_DIR)/gss/trogedit.gss \
		> $(BUILD_DIR)/nodeps.htmleditor.min.css

deps:
	$(JS_DEPSWRITER) \
		--root_with_prefix="$(SRC_DIR) ../../../src" > src/cw/deps.js

s serve_demos:
	python -m SimpleHTTPServer

_ensure_build_dir:
	@mkdir -p $(BUILD_DIR) tmp

clean:
	rm -rf $(BUILD_DIR)
